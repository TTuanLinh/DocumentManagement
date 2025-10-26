import React, { useState } from "react";
import { Search } from 'react-bootstrap-icons'
import { Form, InputGroup } from "react-bootstrap";

function SearchBox() {
  const [searchItem, setSearchItem] = useState();

  const handleSearchChange = (e) => {
    setSearchItem(e.target.value);
  }

  return(
    <InputGroup className="mb-3">
      <InputGroup.Text id="search-icon">
        <Search />
      </InputGroup.Text>
      <Form.Control
        placeholder="Tìm kiếm (theo tên, tag,...)"
        value={searchItem}
        onChange={handleSearchChange}>
      </Form.Control>
    </InputGroup>
  )
}

export default SearchBox;