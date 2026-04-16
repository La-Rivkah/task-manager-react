import React from "react";  
import "./Footer.css";

type Props = {
  total: number;
  completed: number;
};

function Footer({ total, completed }: Props) {
  return (
    <footer className="footer">
      <p>Incompletas: {total - completed}</p>
      <p>Completadas: {completed}</p>
      <p>Total: {total}</p>
    </footer>
  );
}

export default Footer;