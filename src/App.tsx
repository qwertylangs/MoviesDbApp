import { useEffect, useState } from "react"
import { Spin, Pagination, Alert, Tabs } from "antd"

import { IGenre, ILocalFilm } from "./types"
import FilmsList from "./components/FilmsList"
import { useMovieDb } from "./services/movieDb"
import SearchInput from "./components/SearchInput"
import { mergeFilms } from "./utils"
import { MovieContext } from "./context/movieContext"
import "./App.css"

const App = () => {
  const [loading, setloading] = useState<boolean>(false)
  const [films, setFilms] = useState<ILocalFilm[] | []>([])
  const [page, setPage] = useState<number>(1)
  const [query, setQuery] = useState<string>("")

  const [ratedFilms, setRatedFilms] = useState<ILocalFilm[] | []>([])
  const [shouldUpdateRatedFilms, setShouldUpdateRatedFilms] = useState<boolean>(false)

  const [genresList, setGenresList] = useState<IGenre[]>([])

  const { getMovies, createSession, getRatedMovies, rateMovie, getGenres, errors, totalFilms, log } = useMovieDb()

  const updateFilms = (ratedFilmsRes: ILocalFilm[] | []) => {
    getMovies(query, page).then((localFilms) => {
      if (localFilms) {
        const mergedFilms = mergeFilms(localFilms, ratedFilmsRes)
        setFilms(mergedFilms)
        setloading(false)
      }
    })
  }

  useEffect(() => {
    createSession()
    getGenres().then((genres) => {
      if (genres) setGenresList(genres)
    })
  }, [])

  useEffect(() => {
    setloading(true)
    if (shouldUpdateRatedFilms) {
      getRatedMovies().then((ratedFilmsRes) => {
        setRatedFilms(ratedFilmsRes)
        setShouldUpdateRatedFilms(false)
        updateFilms(ratedFilmsRes)
      })
    } else {
      updateFilms(ratedFilms)
    }
  }, [page, query, shouldUpdateRatedFilms])

  const handleTabChange = () => {
    setShouldUpdateRatedFilms(true)
  }

  const Error = () => {
    return errors.map((error, i) => (
      <Alert
        key={i}
        message={error}
        description="Please check you internet connection and try again later"
        type="error"
        showIcon
        style={{ marginBottom: 30 }}
        closable
      />
    ))
  }

  const searchMoviesPage = {
    label: "Search",
    key: "1",
    children: (
      <>
        <SearchInput setQuery={setQuery} setPage={setPage} query={query} />
        {films.length === 0 && !loading && !errors.length && <Alert message="No films found" type="warning" showIcon />}
        {...Error()}
        <FilmsList films={films} />
        <Pagination
          defaultCurrent={1}
          defaultPageSize={20}
          total={totalFilms}
          showSizeChanger={false}
          onChange={(currPage) => {
            setPage(currPage)
            window.scrollTo(0, 0)
          }}
          current={page}
          style={{ textAlign: "center", marginTop: "30px", marginBottom: "20px" }}
        />
      </>
    ),
  }

  const ratedMoviesPage = {
    label: "Rated",
    key: "2",
    children: (
      <>
        {ratedFilms.length === 0 && !loading && !errors.length && (
          <Alert message="No rated films found" type="warning" showIcon />
        )}
        {...Error()}
        <FilmsList films={ratedFilms} />
      </>
    ),
  }

  return (
    <div className="app">
      <MovieContext.Provider value={{ genresList, rateMovie, setShouldUpdateRatedFilms }}>
        <Spin spinning={loading} tip="Loading" size="large" style={{ marginTop: "100px" }}>
          {log && <Alert message={log} type="success" showIcon />}

          <Tabs
            defaultActiveKey="1"
            centered
            items={[searchMoviesPage, ratedMoviesPage]}
            tabBarStyle={{ marginBottom: 20 }}
            size="large"
            destroyInactiveTabPane
            onChange={handleTabChange}
          />
        </Spin>
      </MovieContext.Provider>
    </div>
  )
}

export default App
