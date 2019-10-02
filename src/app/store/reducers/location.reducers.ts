import { ELocationActions } from "../actions/location.actions";
import { LocationActions } from "../actions/location.actions";
import { initialLocationsState } from "../state/location.state";
import { FavoriteLocation } from "../../classes/favorite-location";
import { EWeatherDataState } from "../../enums/eweather-data-state.enum";

export function locationReducers(state = initialLocationsState, action: LocationActions){   
    switch(action.type){
        case ELocationActions.getSelectedLocationSuccess:{
            return {
                ...state,
                selectedLocation: action.payload,
            }
        }
        case ELocationActions.getSelectedLocationDataSuccess:{
            action.payload.weatherDataState = EWeatherDataState.success;
            return {
                ...state,
                selectedLocation: action.payload,
            }
        }
        case ELocationActions.getSelectedLocationDataError:{
            state.selectedLocation.weatherDataState = EWeatherDataState.error;
            return {
                ...state,
            }
        }
        case ELocationActions.getAllFavoriteLocationsSuccess:{
            return {
                ...state,
                favoriteLocations: action.payload,
            }
        }
        case ELocationActions.getFavoriteLocationDataSuccess:{
            /* the purpose of this action is to update the favorite object, which should already exist in the 
               array, with updated weather data */
            const favoritejWithWeatherData = action.payload;
            const favoritesArr = state.favoriteLocations;
            const itemIndexInArr = favoritesArr.findIndex(location => location.key === favoritejWithWeatherData.key);
            if(itemIndexInArr > -1){
                favoritejWithWeatherData.weatherDataState = EWeatherDataState.success;
                favoritesArr[itemIndexInArr] = favoritejWithWeatherData;
            }
            return {
                ...state,
                favoriteLocations: favoritesArr,
            }
        }
        case ELocationActions.getFavoriteLocationDataError:{
            // find the location object in the favorites array and update the state property in the object to error
            const keyOfErrorLocation = action.payload;
            const favoritesArr = state.favoriteLocations;
            const locationWithError = favoritesArr.find(location => location.key === keyOfErrorLocation);
            if(!!locationWithError){
                locationWithError.weatherDataState = EWeatherDataState.error;
            }
            return {
                ...state,
                favoriteLocations: favoritesArr,
            }
        }
        case ELocationActions.removeFavoriteLocationSuccess:{
            const itemToRemove = action.payload;
            const oldFavoritesArr = state.favoriteLocations ? state.favoriteLocations : [];
            const itemIndexInArr = oldFavoritesArr.findIndex(location => location.key === itemToRemove.key);
            if(itemIndexInArr > -1){
                // remove the location from the array...
                oldFavoritesArr.splice(itemIndexInArr, 1);
            }
            return {
                ...state,
                favoriteLocations: oldFavoritesArr,
            }
        }
        case ELocationActions.addFavoriteLocationSuccess:{
            const itemToAdd = action.payload;
            const oldFavoritesArr = state.favoriteLocations ? state.favoriteLocations : [];
            oldFavoritesArr.push(itemToAdd);
            return {
                ...state,
                favoriteLocations: oldFavoritesArr,
            }
        }
        case ELocationActions.addOrRemoveFavoriteLocationError:{
            // the updatedFavoritesArr do not contain any weather data since it came from localStorage
            let updatedFavoritesArr = action.payload;
            const oldFavoritesArr = state.favoriteLocations;
            updatedFavoritesArr = updatedFavoritesArr.map(
                (locationNew: FavoriteLocation) => {
                    /* check if this location already exist in the state. if it is we prefer the one from the state 
                       which contains weather data in it (in case the action came from a remove-location click in 
                       the favorites page) */
                    const locationWithWeatherData = oldFavoritesArr.find(locationOld => locationOld.key === locationNew.key);
                    if(locationWithWeatherData !== null){
                        return locationWithWeatherData;
                    }
                    // if it's not in the state we'll use the one from localStorage
                    return locationNew;
            });
            return {
                ...state,
                favoriteLocations: updatedFavoritesArr,
            }
        }
        default: 
            return state;
    }
}
