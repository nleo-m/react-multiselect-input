import React, { useState } from "react";
import { IMultiselect } from "./types";
import "./style.css";

export const isColorDark = (color) => {
  // Converte a cor para o formato RGB
  const rgb = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  const r = parseInt(rgb[1], 16);
  const g = parseInt(rgb[2], 16);
  const b = parseInt(rgb[3], 16);

  // Calcula a luminosidade da cor usando a fórmula YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Define um valor de limiar para distinguir cores claras e escuras
  const threshold = 128;

  return yiq < threshold;
};

export const getContrastColor = (color) => {
  return isColorDark(color) ? "#E3FFF2" : "#282B2A";
};

const isEmpty = (str) => {
  str = str.trim();
  return str === "" || str === null;
};

export default function MultiSelect({
  fieldName,
  defaultSelection = [],
  options = [],
}: IMultiselect) {
  const [selected, setSelected] = useState(
    defaultSelection.map((option) => {
      return {
        label: option?.label ?? null,
        value: option?.value ?? null,
        color: option?.color ?? null,
      };
    }) || []
  );

  const [availableOptions, setOptions] = useState(
    options
      .map((option) => {
        const isSelected = !selected.some(
          (sel) => sel?.value === option?.value
        );

        if (isSelected)
          return {
            label: option?.label,
            value: option?.value,
            color: option?.color || null,
          };

        return null;
      })
      .filter((option) => option !== null && option !== undefined) || []
  );

  const handleSelect = (e) => {
    if (isEmpty(e.target.value) || e.target.value === "action") return;

    const newValue = {
      label: e.target.options[e.target.selectedIndex].text,
      value: e.target.value,
      color: e.target.options[e.target.selectedIndex]?.dataset.color || null,
    };

    setOptions((availableOptions) => [
      ...availableOptions.filter((option) => option?.value !== newValue?.value),
    ]);

    setSelected((selected) => [...selected, newValue]);
  };

  const handleRemove = (removed) => {
    setOptions((availableOptions) => [...availableOptions, removed]);
    setSelected((selected) => [
      ...selected.filter((option) => option?.value !== removed?.value),
    ]);
  };

  return (
    <div className="multiselect-box">
      <div className="flex">
        {selected?.map((value) => (
          <div
            className="multiselect-badge"
            style={{
              color: value?.color ? getContrastColor(value?.color) : "#282B2A",
              backgroundColor: value?.color || "#c6f6d5",
            }}
          >
            <div className="flex" style={{ alignContent: "center" }}>
              <p className="multiselect-label"> {value?.label}</p>
              <button
                className="multiselect-remove-btn"
                onClick={() => handleRemove(value)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
      <select
        className="multiselect-input"
        onChange={(e) => handleSelect(e)}
        value={""}
      >
        <option value="" selected>
          Selecione...
        </option>
        {availableOptions?.map((option) => (
          <option value={option?.value} data-color={option?.color}>
            {option?.label}
          </option>
        ))}
      </select>
    </div>
  );
}
