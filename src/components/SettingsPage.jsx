import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  FileUpload,
  FileDownload,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuoteModel } from '../hooks/useQuoteModel.js';

const SettingsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  
  const { 
    quotes, 
    loading, 
    addQuote, 
    editQuote, 
    deleteQuote, 
    importQuotes, 
    exportQuotes,
    currentBGColor,
    createGradientFromColor
  } = useQuoteModel();

  // Set background color on mount
  useEffect(() => {
    if (!loading && currentBGColor) {
      const gradient = createGradientFromColor(currentBGColor);
      document.body.style.background = gradient;
      document.body.style.transition = 'background 0.3s ease';
    }
  }, [currentBGColor, createGradientFromColor, loading]);

  const handleAddQuote = () => {
    setEditingQuote(null);
    setQuoteText('');
    setQuoteAuthor('');
    setOpenDialog(true);
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setQuoteText(quote.text);
    setQuoteAuthor(quote.author);
    setOpenDialog(true);
  };

  const handleDeleteQuote = async (id) => {
    try {
      await deleteQuote(id);
      showSnackbar('Quote deleted successfully!', 'success');
    } catch (error) {
      showSnackbar('Error deleting quote', 'error');
    }
  };

  const handleSaveQuote = async () => {
    if (!quoteText.trim() || !quoteAuthor.trim()) {
      showSnackbar('Please fill in both quote and author fields', 'error');
      return;
    }

    try {
      if (editingQuote) {
        await editQuote(editingQuote.id, quoteText.trim(), quoteAuthor.trim());
        showSnackbar('Quote updated successfully!', 'success');
      } else {
        await addQuote(quoteText.trim(), quoteAuthor.trim());
        showSnackbar('Quote added successfully!', 'success');
      }
      setOpenDialog(false);
    } catch (error) {
      showSnackbar('Error saving quote', 'error');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const uploadedQuotes = JSON.parse(e.target.result);
          if (Array.isArray(uploadedQuotes)) {
            await importQuotes(uploadedQuotes);
            showSnackbar('Quotes imported successfully!', 'success');
          } else {
            showSnackbar('Invalid file format', 'error');
          }
        } catch (error) {
          showSnackbar('Error reading file', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileDownload = () => {
    const quotesToExport = exportQuotes();
    const dataStr = JSON.stringify(quotesToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    URL.revokeObjectURL(url);
    showSnackbar('Quotes exported successfully!', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{ color: 'white' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 300,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          Quote Manager
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<FileUpload />}
          component="label"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        >
          Load Quotes from File
          <input
            type="file"
            hidden
            accept=".json"
            onChange={handleFileUpload}
          />
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownload />}
          onClick={handleFileDownload}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        >
          Save Quotes to File
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddQuote}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        >
          Add New Quote
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quote</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id} hover>
                <TableCell sx={{ color: 'white', maxWidth: 400 }}>{quote.text}</TableCell>
                <TableCell sx={{ color: 'white', fontStyle: 'italic' }}>{quote.author}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditQuote(quote)}
                    sx={{ color: 'white', mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteQuote(quote.id)}
                    sx={{ color: 'white' }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            transition: 'none',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          {editingQuote !== null ? 'Edit Quote' : 'Add New Quote'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quote"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
            }}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            variant="outlined"
            value={quoteAuthor}
            onChange={(e) => setQuoteAuthor(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuote} 
            variant="contained"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;