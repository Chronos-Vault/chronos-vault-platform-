/**
 * Incident Response API Routes
 * 
 * Routes for accessing and managing incident response system.
 */

import express, { Request, Response, Router } from 'express';
import { 
  incidentResponseSystem, 
  IncidentType, 
  IncidentSeverity,
  IncidentStatus,
  SystemComponent 
} from '../monitoring/incident-response';

const router: Router = express.Router();

/**
 * Get all incidents
 * 
 * Returns a list of all incidents in the system
 */
router.get('/incidents', (req: Request, res: Response) => {
  try {
    const { 
      status, 
      type, 
      severity, 
      component, 
      limit 
    } = req.query;
    
    // Parse query parameters
    const options: any = {};
    
    if (status && Object.values(IncidentStatus).includes(status as IncidentStatus)) {
      options.status = status;
    }
    
    if (type && Object.values(IncidentType).includes(type as IncidentType)) {
      options.type = type;
    }
    
    if (severity && Object.values(IncidentSeverity).includes(severity as IncidentSeverity)) {
      options.severity = severity;
    }
    
    if (component && Object.values(SystemComponent).includes(component as SystemComponent)) {
      options.component = component;
    }
    
    if (limit) {
      options.limit = parseInt(limit as string);
    }
    
    const incidents = incidentResponseSystem.getIncidents(options);
    
    res.status(200).json({
      status: 'success',
      data: incidents
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve incidents: ' + error.message
    });
  }
});

/**
 * Get a specific incident
 * 
 * Returns the details of a specific incident
 */
router.get('/incidents/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const incident = incidentResponseSystem.getIncident(id);
    
    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: incident
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve incident: ' + error.message
    });
  }
});

/**
 * Get a specific response action
 * 
 * Returns the details of a specific response action
 */
router.get('/actions/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const action = incidentResponseSystem.getAction(id);
    
    if (!action) {
      return res.status(404).json({
        status: 'error',
        message: 'Response action not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: action
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve response action: ' + error.message
    });
  }
});

/**
 * Close an incident
 * 
 * Marks an incident as closed
 */
router.post('/incidents/:id/close', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const success = incidentResponseSystem.closeIncident(id, notes);
    
    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to close incident. Incident may not exist or is not in RESOLVED state.'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Incident closed successfully',
      data: incidentResponseSystem.getIncident(id)
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to close incident: ' + error.message
    });
  }
});

/**
 * Get incident statistics
 * 
 * Returns statistics about incidents
 */
router.get('/statistics', (req: Request, res: Response) => {
  try {
    const statistics = incidentResponseSystem.getIncidentStatistics();
    
    res.status(200).json({
      status: 'success',
      data: statistics
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve incident statistics: ' + error.message
    });
  }
});

/**
 * Generate a test incident (for development/testing only)
 * 
 * Creates a test incident with the specified parameters
 */
router.post('/test-incident', (req: Request, res: Response) => {
  try {
    const { type, severity, component, description } = req.body;
    
    // Validate parameters
    if (type && !Object.values(IncidentType).includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid incident type'
      });
    }
    
    if (severity && !Object.values(IncidentSeverity).includes(severity)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid incident severity'
      });
    }
    
    if (component && !Object.values(SystemComponent).includes(component)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid component'
      });
    }
    
    // Generate test incident
    const incident = incidentResponseSystem.generateTestIncident({
      type,
      severity,
      component,
      description
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Test incident generated successfully',
      data: incident
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate test incident: ' + error.message
    });
  }
});

export default router;