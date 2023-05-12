import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react";
import { useEffect, useLayoutEffect, useState } from "react";

import "./style.scss";

const ContentModal = ({ isOpen, handleClose, children }) => {
  const [htmlFileString, setHtmlFileString] = useState(null);

  async function fetchHtml() {
    const response = await fetch(`htmlContent.html`)
    const data = await response.text()

    return data
  }
  useLayoutEffect(() => {
    fetchHtml().then((data) => {
      setHtmlFileString(data)
    })
  }, [htmlFileString]);

  return (
    <Modal isOpen={isOpen} size={'full'} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w="100%" className="modal-content">
            <div dangerouslySetInnerHTML={{ __html: htmlFileString }}/>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContentModal;
