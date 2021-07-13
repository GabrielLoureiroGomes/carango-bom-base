import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../hooks/AuthContext";
import VehicleRegister from "./VehicleRegister";
import BrandService from "../../services/BrandService";
import VehicleService from "../../services/VehicleService";

const getAllBrandsSpy = jest.spyOn(BrandService, "getAll");
const registerVehicleSpy = jest.spyOn(VehicleService, "register");
const updateVehicleSpy = jest.spyOn(VehicleService, "update");
const getVehicleSpy = jest.spyOn(VehicleService, "get");

const brands = [
  { id: "1", nome: "CHEVROLET" },
  { id: "2", nome: "FIAT" },
  { id: "3", nome: "VOLKS" },
];

const mockVehicle = {
  id: "1",
  model: "Argo",
  year: "2021",
  price: "70000",
  brand: brands[1],
};

let testLocation;
const setup = (vehicleId) => {
  const path = vehicleId ? "/veiculo/:id" : "/veiculo/cadastro";
  const entry = vehicleId ? `/veiculo/${vehicleId}` : "/veiculo/cadastro";
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/", entry]} initialIndex={1}>
        <Route path={path}>
          <VehicleRegister />
        </Route>
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location;
            return null;
          }}
        />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("<VehicleRegister />", () => {
  describe("Register new vehicle", () => {
    beforeEach(async () => {
      getAllBrandsSpy.mockResolvedValue(brands);
      await act(async () => setup());
    });

    describe("Cancel", () => {
      it("should redirect me to '/' when I click the 'cancel' button", () => {
        userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

        expect(testLocation.pathname).toStrictEqual("/");
      });
    });

    describe("All registered brands are loaded into select", () => {
      it("should render the chevrolet option", () => {
        expect(
          screen.getByRole("option", { name: brands[0].nome })
        ).toBeInTheDocument();
      });
      it("should render the fiat option", () => {
        expect(
          screen.getByRole("option", { name: brands[1].nome })
        ).toBeInTheDocument();
      });
      it("should render the volks option", () => {
        expect(
          screen.getByRole("option", { name: brands[2].nome })
        ).toBeInTheDocument();
      });
    });

    describe("Form validation", () => {
      it("should show me an error if I don't fill the 'model' field", async () => {
        const model = screen.getByRole("textbox", { name: /modelo/i });
        fireEvent.focus(model);
        fireEvent.blur(model);

        const errorMsg = await screen.findByText(
          /Modelo deve ter ao menos 2 letras./
        );
        expect(errorMsg).toBeInTheDocument();
      });

      it("should show me an error if I don't fill the 'year' field correctly", async () => {
        const year = screen.getByRole("spinbutton", { name: /ano/i });
        userEvent.type(year, "2035");
        fireEvent.blur(year);

        const errorMsg = await screen.findByText(/Ano inválido/);
        expect(errorMsg).toBeInTheDocument();
      });

      it("should show me an error if I don't fill the 'price' field", async () => {
        const price = screen.getByRole("spinbutton", { name: /valor/i });
        fireEvent.focus(price);
        fireEvent.blur(price);

        const errorMsg = await screen.findByText(/Esse campo é obrigatório/);
        expect(errorMsg).toBeInTheDocument();
      });

      it("should show me an error if I don't select a brand", async () => {
        const brandsSelect = screen.getByRole("combobox", { name: /marca/i });
        userEvent.selectOptions(brandsSelect, "FIAT");
        userEvent.selectOptions(brandsSelect, "");

        const errorMsg = await screen.findByText(/Selecione uma marca/);
        expect(errorMsg).toBeInTheDocument();
      });

      it("should render a disabled 'cadastrar' button if the validation is invalid", () => {
        const model = screen.getByRole("textbox", { name: /modelo/i });
        const price = screen.getByRole("spinbutton", { name: /valor/i });
        userEvent.type(model, mockVehicle.model);
        userEvent.type(price, mockVehicle.price);
        fireEvent.blur(screen.getByRole("spinbutton", { name: /ano/i }));
        expect(
          screen.getByRole("button", { name: /cadastrar/i })
        ).toBeDisabled();
      });
    });

    describe("When submitting register form", () => {
      beforeAll(() => registerVehicleSpy.mockResolvedValue(true));
      beforeEach(async () => {
        const model = screen.getByRole("textbox", { name: /modelo/i });
        const year = screen.getByRole("spinbutton", { name: /ano/i });
        const price = screen.getByRole("spinbutton", { name: /valor/i });
        const brand = screen.getByRole("combobox", { name: /marca/i });
        const btn = screen.getByRole("button", { name: /cadastrar/i });
        userEvent.type(model, mockVehicle.model);
        userEvent.type(year, mockVehicle.year);
        userEvent.type(price, mockVehicle.price);
        userEvent.selectOptions(brand, mockVehicle.brand.nome);
        await act(async () => userEvent.click(btn));
      });

      describe("And the response is successful", () => {
        it("should register vehicle with correct data", async () => {
          expect(registerVehicleSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              model: mockVehicle.model,
              price: mockVehicle.price,
              year: mockVehicle.year,
              brandId: mockVehicle.brand.id,
            })
          );
        });

        it("should redirect me to vehicle list page after register", async () => {
          expect(testLocation.pathname).toBe("/");
        });
      });

      describe("But the response is rejected", () => {
        beforeAll(() => {
          registerVehicleSpy.mockRejectedValue({
            data: "Marca não existe",
            status: 404,
          });
        });

        it("should show the error message", async () => {
          const errorMsg = await screen.findByText(/Marca não existe/i);
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });
  });

  describe("Update existing vehicle", () => {
    beforeEach(async () => {
      getAllBrandsSpy.mockResolvedValue(brands);
      getVehicleSpy.mockResolvedValue({ data: mockVehicle });
      await act(async () => setup(mockVehicle.id));
    });

    describe("It loads the vehicle data into the form", () => {
      it("should render the vehicle model fetched from the param id", () => {
        const input = screen.getByRole("textbox", { name: /modelo/i });
        expect(input.value).toStrictEqual(mockVehicle.model);
      });
      it("should render the vehicle year fetched from the param id", () => {
        const input = screen.getByRole("spinbutton", { name: /ano/i });
        expect(input.value).toStrictEqual(mockVehicle.year);
      });
      it("should render the vehicle price fetched from the param id", () => {
        const input = screen.getByRole("spinbutton", { name: /valor/i });
        expect(input.value).toStrictEqual(mockVehicle.price);
      });
      it("should render the vehicle brand fetched from the param id", async () => {
        const brand = screen.getByRole("combobox", { name: /marca/i });
        expect(brand.value).toStrictEqual(brand[1].id);
      });
    });

    describe("When submitting vehicle update form", () => {
      beforeEach(async () => {
        const model = screen.getByRole("textbox", { name: /modelo/i });
        const brand = screen.getByRole("combobox", { name: /marca/i });

        model.setSelectionRange(0, 4);
        userEvent.type(model, "{backspace}Onix");
        userEvent.selectOptions(brand, brands[0].nome);

        const btn = screen.getByRole("button", { name: /alterar/i });
        await act(async () => userEvent.click(btn));
      });

      describe("And the response is successful", () => {
        it("should call 'VehicleService.update()' with new vehicle data", () => {
          expect(updateVehicleSpy).toBeCalledWith({
            id: mockVehicle.id,
            model: "Onix",
            brandId: brands[0].id,
            price: mockVehicle.price,
            year: mockVehicle.year,
          });
        });

        it("should redirect me back to the vehicle listing page", async () => {
          expect(testLocation.pathname).toStrictEqual("/");
        });
      });

      describe("But the response is rejected", () => {
        beforeAll(() => {
          updateVehicleSpy.mockRejectedValue({
            data: "Veículo não existe",
            status: 404,
          });
        });

        it("should show the error message", async () => {
          const errorMsg = await screen.findByText(/Veículo não existe/i);
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });
  });
});
