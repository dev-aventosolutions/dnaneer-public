import { atom } from "recoil";


export const opportunitiesListAtom = atom({
    key: 'opportunitiesListAtom', // unique ID (with respect to other atoms/selectors)
    default: [1,2,3,4], // default value (aka initial value)
  });
