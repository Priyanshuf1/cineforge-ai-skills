export const ContrastText = ({ children }) => (
  <div style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)', color: '#fff' }}>
    {children}
  </div>
);