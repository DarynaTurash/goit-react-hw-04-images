
export const getMaterials = async (searchQuery, page) => {
    const API_KEY = '36806904-a94ef5850b37be256607932e3'
    const baseURL = 'https://pixabay.com/api/?';
    const PER_PAGE = 24;

    try {
      const response = await fetch(`${baseURL}key=${API_KEY}&q=${searchQuery}&per_page=${PER_PAGE}&page=${page}`);
      const data = await response.json();
      return data;
    
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  };