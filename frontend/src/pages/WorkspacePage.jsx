import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import PublishMenu from '../components/Menu/PublishMenu';
import CreateDishForm from '../components/Dishes/CreateDishForm';
import './WorkspacePage.css';

export default function WorkspacePage() {
  const { namespace } = useParams();
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="workspace">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        namespace={decodeURIComponent(namespace)}
      />

      <main className="workspace__main">
        {/* Декоративные элементы */}
        <div className="workspace__bg-accent" />

        <div className="workspace__content">
          {activeTab === 'menu' && <PublishMenu />}
          {activeTab === 'dish' && <CreateDishForm />}
        </div>
      </main>
    </div>
  );
}