import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TablePagination,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Styled components for dark theme
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: 'rgba(51, 65, 85, 0.5)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  border: '1px solid rgba(71, 85, 105, 0.3)',
  '& .MuiTable-root': {
    minWidth: 650,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    color: '#e2e8f0',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
    padding: '16px 12px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(51, 65, 85, 0.2)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(71, 85, 105, 0.1)',
  },
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.1) !important',
    cursor: 'pointer',
  },
  '& .MuiTableCell-root': {
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
    padding: '12px',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: '#94a3b8',
  padding: '6px',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
  },
  '&.edit': {
    '&:hover': {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      color: '#4ade80',
    },
  },
  '&.delete': {
    '&:hover': {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#f87171',
    },
  },
}));

const PatientTable = ({ 
  patients, 
  onEdit, 
  onDelete, 
  onView, 
  searchTerm,
  calculateAge 
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const paginatedPatients = filteredPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <StyledTableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="patients table">
          <StyledTableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Age</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Health Info</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((patient, index) => (
                <StyledTableRow key={patient.id}>
                  <TableCell>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#e2e8f0',
                          fontSize: '0.875rem'
                        }}
                      >
                        {patient.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#94a3b8',
                          fontSize: '0.75rem'
                        }}
                      >
                        ID: {patient.patientId || patient.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: patient.email ? '#60a5fa' : '#94a3b8',
                        fontSize: '0.875rem'
                      }}
                    >
                      {patient.email || 'Not provided'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={`${calculateAge(patient.dob)} yrs`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#e2e8f0',
                        fontSize: '0.875rem'
                      }}
                    >
                      {patient.contact}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#94a3b8',
                        fontSize: '0.75rem'
                      }}
                    >
                      DOB: {formatDate(patient.dob)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Tooltip title={patient.healthInfo} arrow>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#cbd5e1',
                          fontSize: '0.875rem',
                          cursor: 'help'
                        }}
                      >
                        {truncateText(patient.healthInfo)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="View Details" arrow>
                        <StyledIconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(patient);
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </StyledIconButton>
                      </Tooltip>
                      
                      <Tooltip title="Edit Patient" arrow>
                        <StyledIconButton
                          size="small"
                          className="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(patient);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </StyledIconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Patient" arrow>
                        <StyledIconButton
                          size="small"
                          className="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(patient);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </StyledIconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={6} 
                  align="center"
                  sx={{ 
                    color: '#94a3b8',
                    py: 4,
                    fontSize: '0.875rem'
                  }}
                >
                  {searchTerm ? 'No patients found matching your search.' : 'No patients available.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {filteredPatients.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredPatients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: '#e2e8f0',
              borderTop: '1px solid rgba(71, 85, 105, 0.3)',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: '#94a3b8',
                fontSize: '0.875rem'
              },
              '& .MuiSelect-select, & .MuiIconButton-root': {
                color: '#e2e8f0',
              },
              '& .MuiIconButton-root:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              }
            }}
          />
        )}
      </StyledTableContainer>
    </motion.div>
  );
};

export default PatientTable;