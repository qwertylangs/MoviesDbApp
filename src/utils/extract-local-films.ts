import { IFilm, ILocalFilm } from "../types"

export const extractLocalFilms = (films: IFilm[]): ILocalFilm[] => {
  return films.map((film) => {
    const localDate = Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return {
      id: film.id,
      overview: film.overview || "No description",
      posterUrl: film.poster_path
        ? `https://image.tmdb.org/t/p/original${film.poster_path}`
        : "https://via.placeholder.com/200x300",
      releaseDate: film.release_date ? localDate.format(new Date(film.release_date)) : "No date",
      title: film.title,
      voteAverage: film.vote_average.toFixed(1),
      genreIds: film.genre_ids,
      rating: film.rating,
    }
  })
}
