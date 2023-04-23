import { useCallback, useState } from "react"
import axios from "axios"

import { extractLocalFilms } from "../utils/extract-local-films"

import { IGenre, IGuestSession, ILocalFilm, IFilmsResponce } from "./../types/film"

const API_KEY = "95b2bbdf1af9c5895660a5681ab81632"

const movieApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
})

export const useMovieDb = () => {
  const [errors, setErrors] = useState<string[]>([])
  const [totalFilms, setTotalFilms] = useState<number>(0)

  const [log, setLog] = useState<string>("")

  const sessionId = localStorage.getItem("sessionId")

  const getMovies = useCallback(async (query = "return", page = 1) => {
    query = query || "return"

    try {
      const responce = await movieApi("/search/movie", {
        params: {
          api_key: API_KEY,
          query,
          page,
        },
      })
      if (responce.status === 200) {
        const data: IFilmsResponce = responce.data
        setTotalFilms(data.total_results)

        const localFilms = extractLocalFilms(data.results)
        return localFilms
      } else {
        setErrors([...errors, `Error: ${responce.status} ${responce.statusText}. Cannot get films`])
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors([...errors, `Error: ${error.message}. Cannot get films`])
      }
    }
  }, [])

  const createSession = useCallback(async () => {
    const id = localStorage.getItem("sessionId")
    const expiresAt = localStorage.getItem("sessionExpiresAt")

    if (!(id && expiresAt && new Date(expiresAt) > new Date())) {
      try {
        const responce = await movieApi("/authentication/guest_session/new", {
          params: {
            api_key: API_KEY,
          },
        })
        if (responce.status === 200) {
          const data: IGuestSession = responce.data

          if (data?.success) {
            localStorage.setItem("sessionId", data.guest_session_id)
            localStorage.setItem("sessionExpiresAt", data.expires_at.replace(/-/g, "/"))
          }
        } else {
          setErrors([...errors, `Error: ${responce.status} ${responce.statusText}. Cannot create session`])
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrors([...errors, `Error: ${error.message}. Cannot create session`])
        }
      } finally {
        setLog("New Session created")
      }
    }
  }, [])

  const getRatedMovies = useCallback(async () => {
    let localFilms: ILocalFilm[] = []

    const request = async (page = 1) => {
      try {
        const responce = await movieApi(`/guest_session/${sessionId}/rated/movies`, {
          params: {
            api_key: API_KEY,
            page,
            language: "en-US",
            sort_by: "created_at.asc",
          },
        })
        if (responce.status === 200) {
          const data: IFilmsResponce = responce.data
          localFilms = [...localFilms, ...extractLocalFilms(data.results)]

          if (data.total_pages > page) {
            await request(page + 1)
          }
        } else {
          setErrors([...errors, `Error: ${responce.status} ${responce.statusText}. Cannot get rated films`])
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrors([...errors, `Error: ${error.message}. Cannot get rated films`])
        }
      }
    }
    await request()
    return localFilms
  }, [])

  const rateMovie = useCallback(async (movieId: number, stars: number) => {
    try {
      const responce = await movieApi(`/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionId}`, {
        params: {
          api_key: API_KEY,
        },
        method: "POST",
        data: { value: stars },
      })
      if (responce.status !== 201) {
        setErrors([...errors, `Error: ${responce.status} ${responce.statusText}. Cannot rate film`])
      }

      return responce.data
    } catch (error) {
      if (error instanceof Error) {
        setErrors([...errors, `Error: ${error.message}. Cannot rate film`])
      }
    }
  }, [])

  const getGenres = useCallback(async () => {
    try {
      const responce = await movieApi("/genre/movie/list", {
        params: {
          api_key: API_KEY,
          language: "en-US",
        },
      })
      if (responce.status === 200) {
        return responce.data.genres as IGenre[]
      } else {
        setErrors([...errors, `Error: ${responce.status} ${responce.statusText}. Cannot get genres`])
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors([...errors, `Error: ${error.message}. Cannot get genres`])
      }
    }
  }, [])

  return {
    getMovies,
    createSession,
    getRatedMovies,
    rateMovie,
    getGenres,
    errors,
    totalFilms,
    sessionId,
    log,
  }
}
