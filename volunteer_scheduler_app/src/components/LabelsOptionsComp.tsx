import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { fullEventDetails, labelOptions } from "../utils/helper";
import {
  Autocomplete,
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

interface LabelsOptionsProps {
  toEditEventDetails: fullEventDetails | null;
  isAuth: boolean;
  currentPage: string;
  currentLabelsList: labelOptions[];
  setAllCheckedLabels(labels: labelOptions[]): void;
}

export const LabelsOptionsComp: React.FC<LabelsOptionsProps> = ({
  toEditEventDetails,
  isAuth,
  currentPage,
  currentLabelsList,
  setAllCheckedLabels,
}) => {
  const [labelsOptions, setLabelsOptions] =
    React.useState<labelOptions[]>(currentLabelsList);

  const [checkedLabels, setCheckedLabels] = React.useState<labelOptions[]>(
    toEditEventDetails ? toEditEventDetails.labels : []
  );
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [isPending, setIsPending] = React.useState(true);

  useEffect(() => {
    if (currentLabelsList.length > 0) {
      setLabelsOptions(currentLabelsList);
      setIsPending(false);
    }
  }, [currentLabelsList]);

  const handleOnChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: labelOptions[],
    reason: string
  ): void => {
    setCheckedLabels(value);
    setAllCheckedLabels(value);
  };

  const handleToggle = (value: labelOptions) => {
    const currentIndex = checkedLabels.map((cl) => cl.id).indexOf(value.id);
    const newChecked = [...checkedLabels];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedLabels(newChecked);
    setAllCheckedLabels(newChecked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4.7,
      }}
    >
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        disabled={currentPage != "AddOrEditEvent" && !isAuth}
        defaultValue={checkedLabels}
        value={checkedLabels}
        options={labelsOptions}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, value, reason) =>
          handleOnChange(event, value, reason)
        }
        renderOption={(autocompleteProps, option, { selected }) => (
          <ListItem {...autocompleteProps} key={option.id} disablePadding>
            <ListItemButton
              disabled={currentPage != "AddOrEditEvent" && !isAuth}
              role={undefined}
              onClick={() => handleToggle(option)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  disabled={currentPage != "AddOrEditEvent" && !isAuth}
                  edge="start"
                  checked={
                    toEditEventDetails
                      ? checkedLabels.map((cl) => cl.id).indexOf(option.id) !==
                          -1 || selected
                      : selected
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": option.id.toString(),
                  }}
                />
              </ListItemIcon>
              <ListItemText id={option.id.toString()} primary={option.name} />
            </ListItemButton>
          </ListItem>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} label="Labels:" placeholder="Labels" />
        )}
      />
    </Box>
  );
};
