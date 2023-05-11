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
import { useEffect, useState } from "react";

import "./style.scss";

const ContentModal = ({ isOpen, handleClose, children }) => {
  const [htmlFileString, setHtmlFileString] = useState();

  async function fetchHtml() {
    setHtmlFileString(await (await fetch(`htmlContent.html`)).text());
  }
  useEffect(() => {
    fetchHtml();
  }, []);

  return (
    <Modal isOpen={isOpen} size={'full'} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w="100%" className="modal-content">
            <div
              dangerouslySetInnerHTML={{ __html: htmlFileString }}
              style={{ width: "100%" }}
            />
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
