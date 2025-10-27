'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, User, Shield, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, isAuthenticated, signout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-slate-700 hover:bg-slate-800"
            >
              Home
            </Button>
            <Button
              variant="outline"
              onClick={() => signout()}
              className="border-slate-700 hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-3xl flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-400" />
                Welcome, {user.name}!
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                You've successfully accessed the exclusive insiders area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-300">
                  <span className="font-semibold text-white">Email:</span> {user.email}
                </p>
                <p className="text-slate-300 mt-2">
                  <span className="font-semibold text-white">User ID:</span> {user.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">🎯 Exclusive Content</CardTitle>
                <CardDescription className="text-slate-400">
                  Access premium tutorials and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Get access to advanced tutorials, code samples, and exclusive project templates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">💼 Projects</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your portfolio projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Create, edit, and showcase your projects in a professional portfolio.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">📚 Learning Resources</CardTitle>
                <CardDescription className="text-slate-400">
                  Curated learning materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Access hand-picked courses, articles, and documentation for skill development.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">🔔 Updates</CardTitle>
                <CardDescription className="text-slate-400">
                  Stay informed about new features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Get notified about new content, features, and exclusive opportunities.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Info */}
          <Card className="bg-blue-900/20 border-blue-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                Security Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Your session is secured with JWT authentication and HTTP-only cookies. 
                Your password is encrypted using bcrypt with salt rounds for maximum security.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
