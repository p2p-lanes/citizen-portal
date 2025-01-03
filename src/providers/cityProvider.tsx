import { ApplicationProps } from '@/types/Application';
import { PopupsProps } from '@/types/Popup';
import { ProductsProps } from '@/types/Products';
import { createContext, ReactNode, useContext, useState } from 'react';

interface CityContext_interface {
  getCity: () => PopupsProps | null;
  setCity: (city: PopupsProps) => void;
  getApplications: () => ApplicationProps[];
  setApplications: (application: ApplicationProps[]) => void;
  getRelevantApplication: () => ApplicationProps;
  getPopups: () => PopupsProps[];
  setPopups: (popups: PopupsProps[]) => void;
  updateApplication: (application: ApplicationProps) => void;
  getProducts: () => ProductsProps[]
  setProducts: (products: ProductsProps[]) => void
}

export const CityContext = createContext<CityContext_interface | null>(null);


const CityProvider = ({ children }: {children: ReactNode}) => {
  const [products, setProductsState] = useState<ProductsProps[]>([])
  const [city, setCityState] = useState<PopupsProps | null>(null);
  const [applications, setApplicationsState] = useState<ApplicationProps[]>([]);
  const [popups, setPopupsState] = useState<PopupsProps[]>([]);

  const setProducts = (products: ProductsProps[]) => {
    setProductsState(products)
  }

  const getProducts = () => {
    return products
  }

  const getApplications = (): ApplicationProps[] => {
    return applications
  }

  const setApplications = (applications: ApplicationProps[]): void => {
    setApplicationsState(applications);
  }

  const getCity = (): PopupsProps | null => {
    return city;
  };

  const setCity = (city: PopupsProps): void => {
    setCityState(city);
  };

  const getRelevantApplication = (): ApplicationProps => {
    return applications?.filter((app: ApplicationProps) => app.popup_city_id === city?.id)?.slice(-1)[0]
  }

  const getPopups = (): PopupsProps[] => {
    return popups
  }

  const setPopups = (popups: PopupsProps[]): void => {
    const sortedPopups = popups.sort((a, b) => {
        if (a.visible_in_portal && a.clickable_in_portal) return -1;
        if (b.visible_in_portal && b.clickable_in_portal) return 1;
        if (a.clickable_in_portal) return -1;
        if (b.clickable_in_portal) return 1;
        return 0;
      });
    setPopupsState(sortedPopups);
  }

  const updateApplication = (application: ApplicationProps) => {
    const newApps = applications.filter(ap => ap.id !== application.id)
    setApplications([...newApps, application])
  }

  return (
    <CityContext.Provider value={{
      getCity,
      setCity,
      getApplications,
      setApplications,
      getRelevantApplication,
      getPopups,
      setPopups,
      updateApplication,
      getProducts,
      setProducts
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCityProvider = (): CityContext_interface => {
  const context = useContext(CityContext);
  if (context === null) {
    throw new Error('useCityProvider must be used within a CityProvider');
  }
  return context;
};

export default CityProvider;