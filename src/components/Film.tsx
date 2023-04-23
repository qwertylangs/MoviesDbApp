import { Card, Image, Typography, Tag, Space, Rate } from "antd"
import { useContext, useEffect, useState } from "react"

import { ILocalFilm } from "../types"
import { MovieContext } from "../context/movieContext"

const { Title, Text, Paragraph } = Typography

const Film = ({ title, overview, voteAverage, posterUrl, releaseDate, genreIds, id, rating }: ILocalFilm) => {
  const [prevRating, setPrevRating] = useState<number | undefined>(undefined)
  const [rotingLocal, setRatingLocal] = useState(rating)

  const { genresList, setShouldUpdateRatedFilms, rateMovie } = useContext(MovieContext)

  useEffect(() => {
    if (prevRating !== rating) {
      setRatingLocal(rating)
    }
    setPrevRating(rating)
  }, [rating, prevRating])

  const handleRateChange = (stars: number) => {
    setRatingLocal(stars)
    rateMovie(id, stars).then(() => {
      setShouldUpdateRatedFilms(true)
    })
  }

  const ratingColor =
    +voteAverage > 7 ? "#66E900" : +voteAverage > 5 ? "#E9D100" : +voteAverage > 3 ? "#E97E00" : "#E90000"

  return (
    <Card
      style={{ boxShadow: "0px 2px 10px 1px rgba(34, 60, 80, 0.1)" }}
      bodyStyle={{ padding: 0, position: "relative", height: "100%" }}
      className="card"
    >
      <Image src={posterUrl} alt="film-poster" className="poster" rootClassName="posterRoot" />

      <div className="cardWrapper">
        <div className="cardInfo">
          <div className="cardHeader">
            <Title level={4}>{title}</Title>
            <div className="rating" style={{ borderColor: ratingColor }}>
              {voteAverage}
            </div>
          </div>

          <Text type="secondary" style={{ marginBottom: 6 }}>
            {releaseDate}{" "}
          </Text>

          <Space size={1} wrap style={{ marginBottom: 6 }}>
            {genreIds.map((genreId) => {
              const foundGenre = genresList.find((genre) => genre.id === genreId)
              return <Tag key={genreId}>{foundGenre?.name}</Tag>
            })}
          </Space>
        </div>

        <div className="cardBody">
          <Paragraph style={{ fontSize: 14, lineHeight: "20px", marginBottom: 0 }} ellipsis={{ rows: 4 }}>
            {overview}
          </Paragraph>

          <Rate
            style={{ alignSelf: "flex-end" }}
            count={10}
            allowHalf
            onChange={handleRateChange}
            value={rotingLocal ?? 0}
            className="rate"
          />
        </div>
      </div>
    </Card>
  )
}

export default Film
