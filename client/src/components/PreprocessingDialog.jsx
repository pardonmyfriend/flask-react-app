import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, FormControl, InputLabel, DialogContentText, Checkbox, TextField, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

function PreprocessingDialog({ open, onClose, selectedOption, onSelectChange, cols }) {
    const options = cols;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;


  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{"Preprocess your data"}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Select a column
          </DialogContentText> */}
          <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedOption}
                onChange={onSelectChange}
                label="Select column"
              >

                {options.map((option) => (
                <MenuItem key={option.field} value={option.field}>
                    {option.headerName}
                </MenuItem>
                ))}
              </Select>
                {/* <FormControlLabel
                control={<Checkbox checked={check1} onChange={(e) => handleChange(e, setCheck1)} />}
                label="CheckBox 1"
                /> */}
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.headerName}
                  </li>
                );
              }}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Object" placeholder="Columns" />
              )}
            />
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.headerName}
                  </li>
                );
              }}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Category" placeholder="Columns" />
              )}
            />
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.headerName}
                  </li>
                );
              }}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Numerical" placeholder="Columns" />
              )}
            />
            </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Apply</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PreprocessingDialog;
