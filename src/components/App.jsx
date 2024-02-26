import { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import FetchData from 'services/Api';
import Modal from './Modal/Modal';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Notiflix from 'notiflix';
import * as Scroll from 'react-scroll';
import Button from './Button/Button';

class App extends Component {
  state = {
    searchName: '',
    countPage: 1,
    per_page: 12,
    imageList: [],
    showModal: false,
    showLoadMore: false,
    loading: false,
    openModalItem: { url: '', alt: '' },
  };

  componentDidUpdate(_, prevState) {
    const { searchName, per_page, countPage } = this.state;

    if (
      prevState.countPage !== countPage ||
      prevState.searchName !== searchName
    ) {
      this.setState({ loading: true });
      FetchData(searchName, countPage, per_page)
        .then(data => {
          this.setState({ showLoadMore: true, loading: true });

          const filterDataHits = data.hits.map(img => {
            return Object.fromEntries(
              Object.entries(img).filter(([key]) =>
                ['id', 'tags', 'largeImageURL', 'webformatURL'].includes(key)
              )
            );
          });

          this.setState(prev => ({
            imageList: [...prev.imageList, ...filterDataHits],
            totalHits: data.totalHits,
          }));

          if (countPage === 1) {
            Notiflix.Notify.success(
              `Woo-hoo!!! We've found ${data.totalHits} images.`
            );
          }

          if (countPage > Math.ceil(data.totalHits / per_page)) {
            this.setState({ showLoadMore: false });
            Notiflix.Notify.info(
              "Whoops! You've just reached the end of the image list."
            );
          }
        })
        .catch(this.onApiError)
        .finally(() => this.setState({ loading: false }));
    }
  }

  onApiError = () => {
    Notiflix.Notify.failure(
      'Oops! No images found for your request. Please try again.'
    );
    this.setState({ showLoadMore: false });
  };

  onSubmit = name => {
    this.setState(prev =>
      prev.searchName === name && prev.countPage === 1
        ? { countPage: 1 }
        : {
            searchName: name,
            countPage: 1,
            imageList: [],
          }
    );
  };

  openModal = (url, alt) => {
    const openModalItem = { url, alt };
    this.setState({
      showModal: true,
      openModalItem,
    });
  };

  closeModal = () => this.setState({ showModal: false });

  onLoadMore = () => {
    this.setState(prev => {
      this.setState({ countPage: prev.countPage + 1 });
    });
    this.scrollSlowly();
  };

  scrollSlowly = () => {
    const { height: cardHeight } = document
      .querySelector('#ImageGallery')
      .firstElementChild.getBoundingClientRect();
    Scroll.animateScroll.scrollMore(cardHeight * 2);
  };

  render() {
    const { imageList, showModal, openModalItem, showLoadMore, loading } =
      this.state;
    return (
      <div className="App">
        <Searchbar onSubmit={this.onSubmit} />
        {showModal && (
          <Modal
            url={openModalItem.url}
            alt={openModalItem.alt}
            onClose={this.closeModal}
          />
        )}
        <ImageGallery params={imageList} openModal={this.openModal} />
        {loading && <Loader />}
        {showLoadMore && (
          <Button onClick={this.onLoadMore} title="Load more..." />
        )}
      </div>
    );
  }
}

export default App;
