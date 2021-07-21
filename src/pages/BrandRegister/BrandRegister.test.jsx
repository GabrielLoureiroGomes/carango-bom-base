import React from "react";
import { MemoryRouter } from "react-router-dom";
import { screen, fireEvent, render } from "@testing-library/react";

import BrandRegister from "./BrandRegister";

const setup = (brandId) => {
  return render(
    <MemoryRouter>
      <BrandRegister />
    </MemoryRouter>
  );
};

describe("<BrandRegister />", () => {
  describe("Register new brand", () => {
    beforeEach(() => {
      setup();
    });

    describe("Input", () => {
      it("should show an error when the user leaves focus without typing", async () => {
        const input = screen.getByRole("textbox", { name: /marca/i });

        fireEvent.focus(input);
        fireEvent.blur(input);

        const errorMsg = await screen.findByText(
          /Marca deve ter ao menos 3 letras./
        );
        expect(errorMsg).toBeInTheDocument();
      });
    });
  });
});
