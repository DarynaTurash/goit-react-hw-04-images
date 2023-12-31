import { Modal } from "components/Modal/modal";
import { useState, useEffect} from "react";
import css from "./imageGalleryItem.module.css";



export const ImageGalleryItem = ({id, webformatURL, largeImageURL}) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [largeImage, setLargeImages] = useState('');
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                handleCloseModal();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    const handleBackdropClose = (e) => {
        if(e.currentTarget === e.target) {
            handleCloseModal();
        }
    }

    const handleOpenModal = (largeImageURL) => {
        setIsOpenModal(true);
        setLargeImages(largeImageURL)
    };

    const handleCloseModal = (e) => {
        setIsOpenModal(false);
        setLargeImages("");
    };


    return (
            <li className={css.galleryItem} key={id}>
                <img className={css.galleryItemImage} src={webformatURL} alt="" onClick={() => handleOpenModal(largeImageURL)} />
                {isOpenModal && (
                    <Modal largeImage={largeImage} onCloseModal={handleBackdropClose} />
                )}
            </li>
    );
};



