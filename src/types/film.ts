export interface IFilmsResponce {
  page: number
  results: IFilm[]
  total_pages: number
  total_results: number
}

export interface IFilm {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  rating?: number
}

export interface ILocalFilm {
  id: number
  overview: string
  posterUrl: string
  releaseDate: string
  title: string
  voteAverage: string
  genreIds: number[]
  rating?: number
}

export interface IGuestSession {
  success: boolean
  guest_session_id: string
  expires_at: string
}

export interface IGenre {
  id: number
  name: string
}
