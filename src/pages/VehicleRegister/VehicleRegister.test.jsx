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
  { id: 1, name: "CHEVROLET" },
  { id: 2, name: "FIAT" },
  { id: 3, name: "VOLKS" },
];

const mockVehicle = {
  id: 1,
  brandId: brands[1].id,
  model: "Argo",
  year: "2021",
  price: 70000,
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
          screen.getByRole("option", { name: brands[0].name })
        ).toBeInTheDocument();
      });
      it("should render the fiat option", () => {
        expect(
          screen.getByRole("option", { name: brands[1].name })
        ).toBeInTheDocument();
      });
      it("should render the volks option", () => {
        expect(
          screen.getByRole("option", { name: brands[2].name })
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
        userEvent.paste(year, "2035");
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
        userEvent.paste(model, mockVehicle.model);
        userEvent.paste(price, mockVehicle.price.toString());
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

        userEvent.selectOptions(brand, brands[0].name);
        userEvent.paste(model, mockVehicle.model);
        userEvent.paste(year, mockVehicle.year);
        userEvent.paste(price, mockVehicle.price.toString());
        await act(async () => userEvent.click(btn));

        console.log(model.value);
      });

      describe("And the response is successful", () => {
        it("should register vehicle with correct data", async () => {
          expect(registerVehicleSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              model: mockVehicle.model,
              price: mockVehicle.price,
              year: mockVehicle.year,
              brandId: brands[0].id,
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
          const errorMsg = await screen.findByText(
            /Houve um problema ao registrar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });
  });

  describe("Update existing vehicle", () => {
    beforeEach(async () => {
      getAllBrandsSpy.mockResolvedValue(brands);
      getVehicleSpy.mockResolvedValue(mockVehicle);
      await act(async () => setup(mockVehicle.id));
    });

    describe("It loads the vehicle data into the form", () => {
      it("should render the vehicle brand fetched from the param id", async () => {
        const brand = screen.getByRole("combobox", { name: /marca/i });
        expect(brand.value).toStrictEqual(mockVehicle.brandId.toString());
      });
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
        expect(input.value).toStrictEqual(mockVehicle.price.toString());
      });
    });

    describe("When submitting vehicle update form", () => {
      beforeEach(async () => {
        const model = screen.getByRole("textbox", { name: /modelo/i });
        const brand = screen.getByRole("combobox", { name: /marca/i });

        userEvent.clear(model);
        userEvent.paste(model, "Onix");
        userEvent.selectOptions(brand, brands[0].name);

        const btn = screen.getByRole("button", { name: /alterar/i });
        await act(async () => userEvent.click(btn));
      });

      describe("And the response is successful", () => {
        beforeAll(() => {
          updateVehicleSpy.mockResolvedValue();
        });

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
          const errorMsg = await screen.findByText(
            /Houve um problema ao alterar/i
          );
          expect(errorMsg).toBeInTheDocument();
        });
      });
    });
  });
});
