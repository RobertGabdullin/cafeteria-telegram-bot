import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NamespaceEntryPage from './pages/NamespaceEntryPage';
import WorkspacePage from './pages/WorkspacePage';
import { DishesProvider } from './store/DishesContext';
import { MenuProvider } from './store/MenuContext';

function App() {
  return (
    <DishesProvider>
      <MenuProvider>
        <Routes>
          <Route path="/upload" element={<NamespaceEntryPage />} />
          <Route path="/upload/:namespace" element={<WorkspacePage />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </Routes>
      </MenuProvider>
    </DishesProvider>
  );
}

export default App;