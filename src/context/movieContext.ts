import { Dispatch, SetStateAction, createContext } from "react"

import { IGenre } from "./../types/film"

interface ContextProps {
  genresList: IGenre[]
  rateMovie: (movieId: number, stars: number) => Promise<unknown>
  setShouldUpdateRatedFilms: Dispatch<SetStateAction<boolean>>
}

export const MovieContext = createContext<ContextProps>({
  genresList: [],
  rateMovie: () => new Promise(() => {}),
  setShouldUpdateRatedFilms: () => {},
})
