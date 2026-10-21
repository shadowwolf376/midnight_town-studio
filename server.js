const PORT = process.env.PORT || 3000;
// Add your Express setup here...
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

