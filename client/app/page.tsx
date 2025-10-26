'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Github, Linkedin, Mail, Lock } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, signout } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Hrushinath</h1>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signout()}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push('/signin')}
                className="border-slate-700 hover:bg-slate-800"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold text-white">
              Hi, I'm <span className="text-blue-400">Hrushinath</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300">
              Full Stack Developer | Software Engineer
            </p>
          </div>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Passionate about building scalable web applications and creating elegant solutions
            to complex problems. Specialized in modern web technologies and cloud architecture.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-800">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-800">
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-800">
              <Mail className="h-5 w-5" />
            </Button>
          </div>

          {/* Insiders Only Button */}
          <div className="pt-8">
            <Card className="bg-slate-900/50 border-slate-800 max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Exclusive Content
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Access premium resources and insider content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push('/signin')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Insiders Only
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Frontend</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              <ul className="space-y-2">
                <li>• React, Next.js</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Backend</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              <ul className="space-y-2">
                <li>• Node.js, Express</li>
                <li>• MongoDB, PostgreSQL</li>
                <li>• RESTful APIs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Tools</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              <ul className="space-y-2">
                <li>• Git & GitHub</li>
                <li>• Docker</li>
                <li>• AWS, Vercel</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500">
          <p>&copy; 2025 Hrushinath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
