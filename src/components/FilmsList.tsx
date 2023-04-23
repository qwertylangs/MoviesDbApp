import { ILocalFilm } from "../types"

import Film from "./Film"

interface FilmsListProps {
  films: ILocalFilm[] | []
}

const FilmsList = ({ films }: FilmsListProps) => {
  return (
    <div className="filmsList">
      {films.map((film) => (
        <Film key={film.id} {...film} />
      ))}
    </div>
  )
}

export default FilmsList
