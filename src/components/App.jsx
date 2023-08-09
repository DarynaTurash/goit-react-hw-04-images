import React, { useState, useEffect } from 'react';
import { SearchBar } from './Searchbar/searchbar';
import { Loader } from './Loader/loader';
import { ImageGallery } from './ImageGallery/imageGallery';
import { LoadMore } from './ButtonLoadMore/buttonLoadMore';
import { getMaterials } from '../services/api';
import Notiflix from 'notiflix';

export const App = () => {
  const [materials, setMaterials] = useState([]);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [isLoadMoreShown, setIsLoadMoreShown] = useState(false);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchButtonClicked && searchQuery !== "") {
      fetchMaterials();
      setSearchButtonClicked(false);
    }
  }, [searchButtonClicked, searchQuery]);

  const fetchMaterials = async () => {
    try {
      if (searchQuery === '') {
        Notiflix.Notify.warning('Please, write something into the search field');
        return;
      }

      setStatus('pending');

      const imageData = await getMaterials(searchQuery, page);

      if(imageData.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        setIsLoadMoreShown(false);
        setStatus('idle');
      } else {
        setMaterials([...imageData.hits]);
        setStatus('resolved');
        setIsLoadMoreShown(true);
      }

      
    } catch (error) {
      setStatus('rejected');
      console.error('Error fetching materials:', error);
    }
  };

  const handleSearchSubmit = () => {
    setMaterials([]);
    setPage(1);
    setSearchButtonClicked(true);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;

    try {
      const imagesDataLoadMore = await getMaterials(searchQuery, nextPage);

      setMaterials((prevMaterials) => [...prevMaterials, ...imagesDataLoadMore.hits]);
      setPage(nextPage);
      
      if(nextPage === Math.ceil(imagesDataLoadMore.totalHits / 24)) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        setIsLoadMoreShown(false);
      };
    } catch (error) {
      setStatus('rejected');
      console.error('Error fetching materials:', error);
    }
  };

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearchSubmit} />
      {status === 'pending' && <Loader />}
      {status === 'resolved' && <ImageGallery images={materials} />}
      {isLoadMoreShown && status === 'resolved' && <LoadMore onLoadMore={handleLoadMore} />}
      {status === 'rejected' && <p>Error occurred while fetching materials.</p>}
    </div>
  );
};