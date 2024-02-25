import { Component } from 'react';
import css from './Searchbar.module.css';
import { SiSearxng } from 'react-icons/si';

class Searchbar extends Component {
  state = { value: '' };

  onFormSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.value);
  };

  onChangeInput = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value } = this.state;

    return (
      <header className={css.Searchbar}>
        <form className={css.SearchForm} onSubmit={this.onFormSubmit}>
          <button type="submit" className={css.SearchFormButton}>
            <SiSearxng />
          </button>

          <input
            className={css.SearchFormInput}
            type="text"
            autoComplete="off"
            autoFocus={true}
            value={value}
            onChange={this.onChangeInput}
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}

export default Searchbar;
