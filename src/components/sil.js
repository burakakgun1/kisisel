import React from 'react';
import axios from 'axios';
import { Button } from 'antd';

const Sil = ({ rowId, onDelete }) => {
  const handleDelete = () => {
    axios.delete(`https://v1.nocodeapi.com/yedek/google_sheets/KvEQPWMtJmOfKcUg/${rowId}?tabId=sayfa1`)
      .then(response => {
        console.log('Row deleted successfully:', response);
        onDelete(); // Callback to update parent component after deletion
      })
      .catch(error => {
        console.error('Error deleting row:', error);
      });
  };

  return (
    <Button type="primary" onClick={handleDelete}>
      Sil
    </Button>
  );
};

export default Sil;
