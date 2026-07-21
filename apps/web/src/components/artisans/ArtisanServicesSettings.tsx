'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Briefcase, Loader2, Plus, Trash2, Tag } from 'lucide-react'
import { getCategories, getArtisanServices, addArtisanService, removeArtisanService } from '@/app/actions/services'

export function ArtisanServicesSettings() {
  const [categories, setCategories] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [customDescription, setCustomDescription] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const [catRes, servRes] = await Promise.all([
      getCategories(),
      getArtisanServices()
    ])

    if (catRes.categories) setCategories(catRes.categories)
    if (servRes.services) setServices(servRes.services)
    setIsLoading(false)
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubcategory) {
      setError('Please select a specific skill or service')
      return
    }

    setIsAdding(true)
    setError(null)

    const result = await addArtisanService({
      subcategory_id: selectedSubcategory,
      description: customDescription || undefined,
      price_min: priceMin ? parseFloat(priceMin) : undefined,
      price_max: priceMax ? parseFloat(priceMax) : undefined
    })

    if (result.error) {
      setError(result.error)
    } else {
      // Reset form
      setSelectedCategory('')
      setSelectedSubcategory('')
      setCustomDescription('')
      setPriceMin('')
      setPriceMax('')
      await fetchData() // Refresh list
    }
    setIsAdding(false)
  }

  const handleRemoveService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to remove this service?')) return
    
    setError(null)
    const result = await removeArtisanService(serviceId)
    if (result.error) {
      setError(result.error)
    } else {
      await fetchData()
    }
  }

  const activeCategory = categories.find(c => c.id === selectedCategory)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Skills & Services
        </CardTitle>
        <CardDescription>
          Specify the services you offer. This helps customers find you easily using our AI search and allows you to display your expertise on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Existing Services List */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Your Active Services</h3>
          {isLoading ? (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="text-sm text-muted-foreground border border-dashed rounded-lg p-6 text-center">
              You haven't added any specific services yet.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((svc) => (
                <div key={svc.id} className="border rounded-lg p-3 relative group bg-card">
                  <div className="flex justify-between items-start pr-6">
                    <div>
                      <div className="font-semibold">{svc.subcategory.name}</div>
                      <div className="text-xs text-primary">{svc.subcategory.category.name}</div>
                    </div>
                    {svc.price_min && (
                      <div className="text-xs font-medium bg-muted px-2 py-1 rounded">
                        GHS {Number(svc.price_min)} {svc.price_max && `- ${Number(svc.price_max)}`}
                      </div>
                    )}
                  </div>
                  {svc.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {svc.description}
                    </p>
                  )}
                  <button 
                    onClick={() => handleRemoveService(svc.id)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Service Form */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add a New Skill/Service
          </h3>
          <form onSubmit={handleAddService} className="space-y-4 bg-muted/30 p-4 rounded-lg border">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Trade / Field</label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCategory} 
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedSubcategory('')
                  }}
                >
                  <option value="" disabled>Select a field</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Specific Skill</label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedSubcategory} 
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  <option value="" disabled>Select a skill</option>
                  {activeCategory?.subcategories.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Description (Optional)</label>
              <Input 
                placeholder="E.g., I specialize in Toyota engines, or I use imported Spanish tiles..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Price (GHS)</label>
                <Input 
                  type="number" 
                  placeholder="Optional"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price (GHS)</label>
                <Input 
                  type="number" 
                  placeholder="Optional"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto" disabled={isAdding || !selectedSubcategory}>
              {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Skill to Profile
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
