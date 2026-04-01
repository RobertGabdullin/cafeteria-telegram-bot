import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import PublishMenu from '../components/Menu/PublishMenu';
import CreateDishForm from '../components/Dishes/CreateDishForm';
import Button from '../components/UI/Button';
import './WorkspacePage.css';

export default function WorkspacePage() {
  const { namespace } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="workspace">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        namespace={decodeURIComponent(namespace)}
      />

      <main className="workspace__main">
        <div className="workspace__bg-accent" />

        <div className="workspace__topbar">
          <Button variant="ghost" size="small" onClick={() => navigate('/upload')}>
            ← Сменить namespace
          </Button>
        </div>

        <div className="workspace__content">
          {activeTab === 'menu' && <PublishMenu />}
          {activeTab === 'dish' && <CreateDishForm />}
        </div>
      </main>
    </div>
  );
}