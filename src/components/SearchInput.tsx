import { useCallback, useEffect, useState } from "react"
import { Input } from "antd"
import { debounce } from "lodash"

interface SearchInputProps {
  query: string
  setQuery: (query: string) => void
  setPage: (page: number) => void
}

const SearchInput = ({ setQuery, setPage, query }: SearchInputProps) => {
  const [prevText, setPrevText] = useState<string | undefined>(undefined)
  const [text, setText] = useState<string>("")

  useEffect(() => {
    if (prevText !== query) {
      setText(query)
    }
    setPrevText(query)
  }, [query])

  const debouncedSearch = useCallback(
    debounce((searchText: string) => {
      setQuery(searchText)
      setPage(1)
    }, 500),
    []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    debouncedSearch(e.target.value)
  }

  return (
    <div className="searchInput">
      <Input placeholder="Type to search" maxLength={70} onChange={handleSearch} value={text} size="large" />
    </div>
  )
}

export default SearchInput
