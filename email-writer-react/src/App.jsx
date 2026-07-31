import { useState } from 'react'
import { Box, Container, TextField, Typography, InputLabel, Select, FormControl, MenuItem, Button, CircularProgress } from '@mui/material'
import axios from 'axios'

function App() {
  const [content, setContent] = useState('')
  const [tone, setTone] = useState('')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post("http://localhost:8080/api/email/generate",{
        content,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    }
    catch (error) {
      setError('Failed to generate reply. Could you please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{py:4}}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={content || ""}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}>
        </TextField>

        <FormControl fullWidth sx={{mb:2}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone || ""}
            label={"Tone (Optional)"}
            onChange={(e) => setTone(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="sarcastic">Sarcastic</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!content || loading}
          fullWidth>
          {loading ? <CircularProgress size={24}/>: "Generate Reply"}
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{mx:2}}>
          {error}
        </Typography>
      )}

      {generatedReply &&(
        <Box sx={{mt:3}}>
          <Typography variant='h6' gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Generated Reply"
            value={generatedReply || ""}
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
          <Button
            variant='outlined'
            sx={{mt:2}}
            onClick={() => navigator.clipboard.writeText(generatedReply)}>
              Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App
