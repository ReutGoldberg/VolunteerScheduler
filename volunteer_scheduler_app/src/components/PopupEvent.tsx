
import * as React from "react";
import "../App.css";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import {
  Button,
  Box,
  InputAdornment,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import { EventDatePicker } from "./EventDatePicker";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MaximizeIcon from "@mui/icons-material/Maximize";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { start } from "repl";
import { isAdminUser, getLabels} from "../utils/DataAccessLayer";
import {fullEventDetails, labelOptions} from "../utils/helper";


export const PopupEvent: React.FC = () => {

    const [eventName, setEventName] = React.useState("");
    const [eventNameValid, setEventNameValid] = React.useState(true);

    const [eventInfo, setEventInfo] = React.useState("");
    const [eventInfoValid, setEventInfoValid] = React.useState(true);

    const [eventLocation, setEventLocation] = React.useState("");
    const [eventLocationValid, setEventLocationValid] = React.useState(true);

    const [eventMaxParticipants, setEventMaxParticipants] = React.useState("");
    const [eventMaxParticipantsValid, setEventMaxParticipantsValid] = React.useState(true);

    const [eventMinParticipants, setEventMinParticipants] = React.useState("");
    const [eventMinParticipantsValid, setEventMinParticipantsValid] = React.useState(true);

    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [startDateValid, setStartDateValid] = React.useState(true);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [endDateValid, setEndDateValid] = React.useState(true);

    const [allDayChecked, setAllDayChecked] = React.useState(false);
    const [isAllDayDisable, setIsAllDayDisable] = React.useState(false);

    const [labelOptions, setlabelOptions] = React.useState<labelOptions[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [label, setlabel] = React.useState("");

    return (
        <Box/>        
    )
}