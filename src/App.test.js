import { render, screen } from "@testing-library/react";
import App from "./App";

test("Tabela aparece com marca", () => {
  render(<App />);
  const linkElement = screen.getByText(/marca/i);
  expect(linkElement).toBeInTheDocument();
});
