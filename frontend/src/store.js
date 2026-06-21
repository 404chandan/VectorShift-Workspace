// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    // Core Workflow Editor State
    nodes: [],
    edges: [],
    nodeIDs: {},

    // Auth & View Routing State
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    currentView: localStorage.getItem('token') ? 'dashboard' : 'landing',
    workspaces: [],
    activeWorkspaceId: null,
    activeWorkspaceName: '',

    // Actions
    setCurrentView: (view) => set({ currentView: view }),

    setUser: (user, token) => {
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token, currentView: 'dashboard' });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ 
                user: null, 
                token: null, 
                currentView: 'landing', 
                workspaces: [], 
                activeWorkspaceId: null, 
                activeWorkspaceName: '', 
                nodes: [], 
                edges: [], 
                nodeIDs: {} 
            });
        }
    },

    logout: () => {
        get().setUser(null, null);
    },

    setWorkspaces: (workspaces) => set({ workspaces }),

    loadWorkspace: (workspace) => {
        set({
            activeWorkspaceId: workspace.id,
            activeWorkspaceName: workspace.name,
            nodes: workspace.nodes || [],
            edges: workspace.edges || [],
            nodeIDs: workspace.nodeIDs || {},
            currentView: 'workspace'
        });
    },

    resetWorkspace: () => {
        set({
            activeWorkspaceId: null,
            activeWorkspaceName: '',
            nodes: [],
            edges: [],
            nodeIDs: {}
        });
    },

    updateWorkspaceName: (name) => {
        set({ activeWorkspaceName: name });
    },

    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },

    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },

    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },

    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },

    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },

    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
   
          return node;
        }),
      });
    },
  }));
