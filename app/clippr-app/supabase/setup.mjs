// Script para setup inicial do banco de dados Clippr v2.0
// Execute com: node supabase/setup.mjs

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Erro: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.');
    console.error('   Configure-os via variáveis de ambiente ou em um arquivo .env');
    process.exit(1);
}

const headers = {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

// Barbearia de exemplo
const demoBarbershop = {
    name: 'Clippr Barbearia Premium',
    slug: 'clippr-barbearia-premium',
    description: 'A melhor experiência em cuidados masculinos. Ambiente moderno, profissionais qualificados e atendimento excepcional.',
    logo_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop',
    cover_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=400&fit=crop',
    address: 'Rua das Barbearias',
    address_number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01310-100',
    latitude: -23.5505,
    longitude: -46.6333,
    phone: '(11) 99999-9999',
    whatsapp: '5511999999999',
    email: 'contato@clippr.com.br',
    instagram: '@clippr.barbearia',
    subscription_status: 'trial',
    is_active: true,
    is_verified: true,
    rating: 4.8,
    review_count: 127
};

// Barbeiros
const barbers = [
    { name: 'Carlos Silva', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', specialty: 'Cortes Modernos', rating: 4.9, review_count: 127, available: true, commission_rate: 50, is_owner: true },
    { name: 'André Santos', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', specialty: 'Barba & Degradê', rating: 4.8, review_count: 98, available: true, commission_rate: 50 },
    { name: 'Rafael Costa', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', specialty: 'Cortes Clássicos', rating: 4.7, review_count: 156, available: true, commission_rate: 45 },
    { name: 'Lucas Oliveira', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', specialty: 'Pigmentação', rating: 4.9, review_count: 89, available: true, commission_rate: 50 },
];

// Serviços
const services = [
    { name: 'Corte Masculino', description: 'Corte tradicional com acabamento perfeito', duration: 30, price: 45.00, icon: 'cut-outline', category: 'corte', active: true },
    { name: 'Degradê', description: 'Degradê low, mid ou high fade', duration: 45, price: 55.00, icon: 'layers-outline', category: 'corte', active: true },
    { name: 'Barba Completa', description: 'Corte, desenho e hidratação da barba', duration: 30, price: 35.00, icon: 'man-outline', category: 'barba', active: true },
    { name: 'Combo Corte + Barba', description: 'Corte masculino + barba completa', duration: 60, price: 70.00, icon: 'star-outline', category: 'combo', active: true },
    { name: 'Sobrancelha', description: 'Design e alinhamento de sobrancelhas', duration: 15, price: 20.00, icon: 'eye-outline', category: 'outros', active: true },
    { name: 'Hidratação Capilar', description: 'Tratamento profundo para cabelos', duration: 45, price: 50.00, icon: 'water-outline', category: 'tratamento', active: true },
    { name: 'Pigmentação', description: 'Coloração e pigmentação capilar', duration: 60, price: 80.00, icon: 'color-palette-outline', category: 'tratamento', active: true },
    { name: 'Combo Premium', description: 'Corte + Barba + Sobrancelha + Hidratação', duration: 90, price: 120.00, icon: 'diamond-outline', category: 'combo', active: true },
];

async function insertData(table, data, upsert = false) {
    console.log(`📝 Inserindo dados em ${table}...`);

    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const prefer = upsert ? 'return=representation,resolution=merge-duplicates' : 'return=representation';

    const response = await fetch(url, {
        method: 'POST',
        headers: { ...headers, 'Prefer': prefer },
        body: JSON.stringify(Array.isArray(data) ? data : [data]),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Erro ao inserir em ${table}:`, error);
        return null;
    }

    const result = await response.json();
    console.log(`✅ ${Array.isArray(result) ? result.length : 1} registro(s) inserido(s) em ${table}`);
    return result;
}

async function updateData(table, data, match) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${new URLSearchParams(match)}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Erro ao atualizar ${table}:`, error);
        return null;
    }

    return await response.json();
}

async function main() {
    console.log('🚀 Iniciando setup do banco de dados Clippr v2.0...\n');

    // 1. Inserir barbearia demo
    const barbershopResult = await insertData('barbershops', demoBarbershop);
    const barbershopId = barbershopResult?.[0]?.id;

    if (!barbershopId) {
        console.log('\n⚠️  Barbearia já existe ou erro na criação. Buscando ID...');
        // Tentar buscar a barbearia existente
        const searchResponse = await fetch(`${SUPABASE_URL}/rest/v1/barbershops?slug=eq.clippr-barbearia-premium`, {
            headers
        });
        const existing = await searchResponse.json();
        if (existing?.[0]?.id) {
            console.log(`✅ Barbearia encontrada: ${existing[0].id}`);
            await setupBarbershopData(existing[0].id);
        }
        return;
    }

    await setupBarbershopData(barbershopId);
}

async function setupBarbershopData(barbershopId) {
    // 2. Atualizar barbeiros com barbershop_id
    console.log('\n📝 Atualizando barbeiros...');
    for (const barber of barbers) {
        await insertData('barbers', { ...barber, barbershop_id: barbershopId });
    }

    // 3. Atualizar serviços com barbershop_id
    console.log('\n📝 Atualizando serviços...');
    for (const service of services) {
        await insertData('services', { ...service, barbershop_id: barbershopId });
    }

    console.log('\n✅ Setup concluído com sucesso!');
    console.log(`\n📍 Barbearia ID: ${barbershopId}`);
    console.log('🌐 Slug: clippr-barbearia-premium');
}

main().catch(console.error);
