import styles from '../styles/Services.module.css'

export default function Services() {
  const services = [
    {
      title: 'Revisão Fiscal',
      description:
        'Identificamos erros e oportunidades para reduzir custos tributários.',
    },
    {
      title: 'Redução Tributária',
      description:
        'Estratégias para pagar menos impostos dentro da lei e aumentar sua margem de lucro.',
    },
    {
      title: 'Consultoria Personalizada',
      description:
        'Atendimento dedicado para bares, restaurantes, mercados e açougues.',
    },
  ]

  return (
    <section id="services" className={styles.services}>
      <div className="container">
        <h2 className={styles.title}>Nossos Serviços</h2>
        <div className={styles.grid}>
          {services.map((service, i) => (
            <div key={i} className={styles.card}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
