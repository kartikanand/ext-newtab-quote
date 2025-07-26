import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Fade, 
  Fab, 
  SpeedDial, 
  SpeedDialAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Settings, 
  Refresh, 
  Menu as MenuIcon,
  Add,
  Shuffle,
  Palette,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuoteModel } from '../hooks/useQuoteModel.js';

const NewTabPage = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [colorMenuAnchor, setColorMenuAnchor] = useState(null);
  const navigate = useNavigate();
  
  const { 
    getRandomQuote, 
    loading, 
    addQuote, 
    currentBGColor, 
    getBGColors, 
    setCurrentBGColor, 
    createGradientFromColor 
  } = useQuoteModel();

  useEffect(() => {
    if (!loading) {
      loadRandomQuote();
      setIsVisible(true);
    }
  }, [loading]);

  // Separate effect for background color to prevent flickering
  useEffect(() => {
    if (!loading && currentBGColor) {
      const gradient = createGradientFromColor(currentBGColor);
      document.body.style.background = gradient;
      document.body.style.transition = 'background 0.3s ease';
    }
  }, [currentBGColor, createGradientFromColor, loading]);

  const loadRandomQuote = () => {
    const quote = getRandomQuote();
    if (quote) {
      setCurrentQuote(quote);
    }
  };

  const handleRefresh = () => {
    setIsVisible(false);
    setTimeout(() => {
      loadRandomQuote();
      setIsVisible(true);
    }, 300);
  };

  const handleAddQuote = () => {
    setQuoteText('');
    setQuoteAuthor('');
    setOpenDialog(true);
  };

  const handleSaveQuote = async () => {
    if (!quoteText.trim() || !quoteAuthor.trim()) {
      return;
    }
    
    try {
      await addQuote(quoteText.trim(), quoteAuthor.trim());
      setOpenDialog(false);
      // Show the new quote immediately
      setTimeout(loadRandomQuote, 100);
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  };

  const handleColorChange = async (color) => {
    setColorMenuAnchor(null);
    await setCurrentBGColor(color);
  };

  const speedDialActions = [
    {
      icon: <Settings />,
      name: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      icon: <Shuffle />,
      name: 'Random Quote',
      onClick: handleRefresh,
    },
    {
      icon: <Add />,
      name: 'Add Quote',
      onClick: handleAddQuote,
    },
    {
      icon: <Palette />,
      name: 'Change Color',
      onClick: (event) => setColorMenuAnchor(event.currentTarget),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        position: 'relative',
      }}
    >
      <Fade in={isVisible} timeout={500}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 800,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          {currentQuote && (
            <>
              <Typography
                variant="h4"
                component="blockquote"
                sx={{
                  color: 'white',
                  fontStyle: 'italic',
                  marginBottom: 2,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  lineHeight: 1.4,
                }}
              >
                "{currentQuote.text}"
              </Typography>
              <Typography
                variant="h6"
                component="cite"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 300,
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                — {currentQuote.author}
              </Typography>
            </>
          )}
        </Box>
      </Fade>

      {/* Floating Action Menu */}
      <SpeedDial
        ariaLabel="Quote actions"
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        icon={<MenuIcon />}
        FabProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.05)',
            },
          },
        }}
        transitionDuration={200}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            FabProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.02)',
                },
              },
            }}
          />
        ))}
      </SpeedDial>

      {/* Color Selection Menu */}
      <Menu
        anchorEl={colorMenuAnchor}
        open={Boolean(colorMenuAnchor)}
        onClose={() => setColorMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            mt: 1,
            transition: 'none',
          },
        }}
        MenuListProps={{
          sx: {
            display: 'flex',
            flexDirection: 'row',
            p: 1,
            gap: 1,
          },
        }}
      >
        {getBGColors().map((color) => (
          <MenuItem
            key={color}
            onClick={() => handleColorChange(color)}
            sx={{
              minWidth: 'auto',
              width: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: createGradientFromColor(color),
                border: currentBGColor === color ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
            <Typography 
              variant="caption"
              sx={{ 
                color: 'white',
                fontWeight: currentBGColor === color ? 600 : 400,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                fontSize: '0.7rem',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {color === "#DBC4F0" && "Lavender"}
              {color === "#A1CCD1" && "Aqua"}
              {color === "#ACB1D6" && "Periwinkle"}
              {color === "#AAC8A7" && "Sage"}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Add Quote Dialog */}
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
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Add New Quote
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
    </Box>
  );
};

export default NewTabPage;