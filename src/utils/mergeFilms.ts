import { ILocalFilm } from "../types"

export const mergeFilms = (films: ILocalFilm[], ratedFilms: ILocalFilm[]) =>
  films.map((film) => {
    const ratedFilm = ratedFilms.find((f) => f.id === film.id)
    if (ratedFilm) {
      film.rating = ratedFilm.rating
    }
    return film
  })
