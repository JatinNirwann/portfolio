import React from 'react';

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  year: string;
  url: string;
  status: 'completed' | 'under dev';
  topics: string[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  items?: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  language: string;
  fork: boolean;
}