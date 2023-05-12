import { Box, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { useQuery } from 'react-query'
import AllRulesTable from './AllRulesTable'

const ModalAllRules = ({submission_id, isOpen, setIsOpen}) => {
  const { data, isLoading } = useQuery(
    ['allRules', submission_id], 
    async () => {
      const response = await axios.get(`http://eastontj.ddns.net:7000/getRules/${submission_id}`)
      const data = response.data

      return data
    },
    {}
  )

  const handleClose = () => {
    setIsOpen(false)
  }

  // const data = []

  return (
    <Modal isOpen={isOpen} size={'full'} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="xl">All Rules</ModalHeader>
        <ModalCloseButton />
        <Box width="100%" overflowX="auto">
          <AllRulesTable allRulesData={data} />
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default ModalAllRules