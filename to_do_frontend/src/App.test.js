import { render, screen } from "@testing-library/react";
import Header from "./components/Header";

test("renders header title", () => {
  render(<Header total={0} completed={0} />);
  const title = screen.getByText(/To‑Do/i);
  expect(title).toBeInTheDocument();
});
