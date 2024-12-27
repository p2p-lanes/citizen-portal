import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductsAttendee } from "./ProductsAttendee"
import { ProductsPass, ProductsProps } from "@/types/Products"
import { AttendeeProps } from "@/types/Attendee"
import { useMemo, useState } from "react"
import PaymentHistory from "./PaymentHistory"
import { ApplicationProps, TicketCategoryProps } from "@/types/Application"

interface PassesSidebarProps {
  productsPurchase: ProductsProps[], 
  attendees: AttendeeProps[], 
  payments: any[],
  category: TicketCategoryProps
}

const defaultProducts = (products: ProductsProps[], attendees: AttendeeProps[], category: TicketCategoryProps): ProductsPass[] => {
  const mainAttendee = attendees.find(a => a.category === 'main') ?? { id: 0, products: [] }

  const isScholarship = category === 'Scholarship'
  const isPatreon = mainAttendee.products?.some(p => p.category === 'patreon')
  const isBuilder = category === 'Builder'

  return products.map(p => {
    if(p.category !== 'patreon'){
      return {
        ...p,
        // Si es patreon o scholarship, el precio es 0, si es builder, usa builder_price si está disponible, si no, usa price
        price: (isPatreon || isScholarship) ? 0 : isBuilder ? p.builder_price ?? p.price : p.price,
        original_price: p.compare_price, // Precio original para mostrar tachado
      }
    }
    return p
  }) as ProductsPass[]
}

const PassesSidebar = ({productsPurchase, attendees, payments, category}: PassesSidebarProps) => {
  const initialProducts = useMemo(() => defaultProducts(productsPurchase, attendees, category), [productsPurchase, attendees, category])
  const [products, setProducts] = useState<ProductsPass[]>(initialProducts)

  const toggleProduct = (attendee: AttendeeProps | undefined, product?: ProductsPass) => {
    console.log('attendee', attendee)
    if (!product || !attendee) return;

    setProducts(prev => {
      // Manejo de productos Patreon
      if (product.category === 'patreon') {
        if (product.selected) {
          return initialProducts;
        }
        return prev.map(p => ({...p, price: p.category === 'patreon' ? p.price : 0, selected: p.id === product.id, attendee_id: p.id === product.id ? attendee.id : p.attendee_id}))
      }

      // Crear nueva lista de productos con el toggle básico
      const newProducts = prev.map(p => ({
        ...p,
        attendee_id: p.id === product.id ? attendee.id : p.attendee_id,
        selected: p.id === product.id ? !p.selected : p.selected
      }));

      // Si es un producto "month" que se está des-seleccionando, des-seleccionar todos los weeks del attendee
      if (product.category === 'month' && product.selected) {
        return newProducts.map(p => ({
          ...p,
          selected: p.category === 'week' && p.attendee_id === attendee.id ? false : p.selected
        }));
      }

      // Si es un producto "week", verificar si todos los weeks del attendee están seleccionados
      if (product.category === 'week') {
        const willBeSelected = !product.selected; // El nuevo estado del producto
        if (willBeSelected) {
          const allWeeksSelected = newProducts
            .filter(p => (p.category === 'week' && p.attendee_id === attendee.id && p.selected)).length === 4

          // Si todos los weeks estarán seleccionados, seleccionar el month correspondiente
          if (allWeeksSelected) {
            const monthProduct = newProducts.find(p => p.category === 'month' && p.attendee_category === attendee.category);

            if (monthProduct) {
              return newProducts.map(p => ({
                ...p,
                selected: p.id === monthProduct.id ? true : p.selected,
                attendee_id: p.id === monthProduct.id ? attendee.id : p.attendee_id
              }));
            }
          }
        }
      }

      return newProducts;
    });
  };

  return (
    <div className="mt-6 md:mt-0">
      <Tabs defaultValue="passes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="passes">Passes</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="passes">
          <ProductsAttendee products={products} attendees={attendees} onToggleProduct={toggleProduct} />
        </TabsContent>

        <TabsContent value="payment-history">
          <PaymentHistory payments={payments}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default PassesSidebar