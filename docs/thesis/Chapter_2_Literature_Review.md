# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction
The advent and rapid proliferation of digital marketplaces have fundamentally revolutionized service delivery and commerce across the globe. In Sub-Saharan Africa, and Ghana in particular, digital platforms are increasingly acting as critical intermediaries, bridging the historical gap between informal, localized service providers and modern, connected consumers. 

This chapter systematically reviews existing academic literature and industry reports on the evolution of the gig economy, particularly focusing on its integration with the traditional informal sector in West Africa. Furthermore, it critically examines the indispensable role of institutional trust and financial escrow systems in sustaining online peer-to-peer (P2P) marketplaces. It then explores the modern application of Artificial Intelligence (AI) in solving core marketplace friction points, namely intent-based matchmaking (semantic search) and conflict arbitration (dispute resolution). Finally, the chapter concludes with a comprehensive comparative analysis of existing classified platforms in Ghana, such as Jiji Ghana and Tonaton, highlighting the gaps that ArtisanConnect aims to fill.

## 2.2 The Gig Economy and the Informal Sector in Ghana
### 2.2.1 The Traditional Informal Landscape
The informal sector forms the unquestionable backbone of the Ghanaian economy. According to a comprehensive report by Osei-Boateng and Ampratwum (2011), informal economic activities account for over 80% of total national employment. This sector includes street vendors, transport operators, and critically, artisanal tradesmen such as plumbers, electricians, carpenters, and masons, whose services are essential for both urban survival and rural development. 

Despite its massive scale, the traditional artisanal sector operates almost entirely outside the purview of formal quality assurance, standardized pricing, and regulatory oversight. Artisans have historically relied on physical visibility (e.g., waiting at popular junctions) and localized word-of-mouth networks to secure sporadic employment. This localized model inherently suffers from high information asymmetry; consumers cannot effectively verify an artisan's skill level prior to employment, leading to widespread dissatisfaction and depressed wages (Anyidoho, 2013).

### 2.2.2 The Transition to the Digital Gig Economy
The introduction of the "gig economy"—broadly defined as a labor market characterized by short-term contracts or freelance work facilitated by digital platforms—offers a transformative pathway to formalize these informal interactions. Heeks (2017) posits in his extensive work on Information and Communication Technology for Development (ICT4D) that digital gig platforms can significantly reduce transaction costs and mitigate information asymmetry in developing nations. 

By aggregating supply and demand onto a centralized digital interface, gig platforms provide unprecedented visibility for blue-collar workers. However, the literature also highlights severe structural challenges. A profound lack of institutional trust, varying levels of digital literacy among older artisans, and the precarious, unprotected nature of gig work often leave workers vulnerable to exploitation and income instability (Graham et al., 2017). Therefore, for digital platforms to be truly developmental rather than exploitative, they must evolve beyond mere "matchmaking" to incorporate robust mechanisms that actively protect both the consumer and the service provider.

## 2.3 Trust Mechanisms: Escrow Systems in E-Commerce
Trust is the absolute, most critical currency in peer-to-peer (P2P) marketplaces. In the context of artisanal services, the transaction is fraught with dual-sided risk: consumers face high risks of substandard work, property damage, or prepayment theft, while artisans face the equally detrimental risk of non-payment after labor has been expended.

### 2.3.1 Institutional vs. Interpersonal Trust
Research by Pavlou and Gefen (2004) distinguishes between interpersonal trust (trusting the individual artisan) and institution-based trust (trusting the platform facilitating the transaction). Their studies indicate that in environments where interpersonal trust is low (such as hiring a stranger off the internet), robust institutional structures—like integrated escrow services and verified reviews—are mandatory to mitigate perceived risks and encourage consumer participation.

### 2.3.2 The Role of Escrow in Preventing Fraud
Escrow services act as neutral, trusted third-party mediators that hold financial funds securely until predefined conditions of a transaction are demonstrably met (Bansal et al., 2004). In developing economies like Ghana, where legal recourse for small-scale financial disputes (e.g., a GHS 200 plumbing job) is practically impossible due to high legal fees and slow judicial processes, technology must fill the gap. 

Integrated escrow systems are vital for preventing "advance-fee fraud" or prepayment scams—a pervasive challenge in open, unmanaged classified networks. By locking the funds, the consumer is guaranteed that their money will not be stolen if the artisan fails to deliver, and the artisan is guaranteed that the funds actually exist and will be released upon successful completion.

## 2.4 Artificial Intelligence in Marketplaces
The integration of Artificial Intelligence (AI) and Large Language Models (LLMs) has fundamentally transformed how modern platforms match users and handle operational bottlenecks.

### 2.4.1 AI-Powered Semantic and Hybrid Search
Traditional e-commerce platforms rely on keyword-based search algorithms (e.g., Apache Solr or Elasticsearch). While effective for exact-match products (e.g., "iPhone 13"), they fail drastically in service marketplaces where consumers express their needs via natural language symptoms rather than technical job titles. For instance, a user searching for "water leaking rapidly from my ceiling" requires a Roofing Specialist or Plumber, but standard keyword searches may yield zero results if the specific word "plumber" is omitted.

Turney (2001) laid the early groundwork for semantic analysis, arguing that extracting meaning from text is superior to matching strings. Modern Hybrid search systems combine dense vector embeddings (representing the semantic, contextual meaning of a phrase) with sparse keyword algorithms, significantly improving retrieval accuracy. By mapping user queries to a high-dimensional vector space using models like Google's Gemini, platforms can accurately infer the required artisanal skill based solely on conversational descriptions, bridging the digital literacy gap.

### 2.4.2 AI in Online Dispute Resolution (ODR)
As marketplaces scale, human moderation of disputes becomes a massive operational bottleneck. Online Dispute Resolution (ODR) systems are increasingly adopting Natural Language Processing (NLP) to parse, summarize, and evaluate user interactions. According to Rule (2020), AI can rapidly process massive volumes of chat logs to highlight key agreements, identify toxic behavior, and flag breaches of contract. This automated summarization streamlines the administrative review process, reduces the cognitive load on human moderators, and ensures faster, more objective conflict resolution.

## 2.5 Comparative Analysis of Existing Platforms in Ghana
Ghana's digital ecosystem currently features several classified ad platforms, with Jiji Ghana and Tonaton being the most prominent. While these platforms facilitate a wide array of trade and have high daily active user counts, they are fundamentally designed as open bulletin boards rather than managed, closed-loop marketplaces.

### 2.5.1 The Limitations of Open Classifieds (Jiji Ghana)
Jiji Ghana connects buyers and sellers effectively but explicitly avoids intermediating the actual transactions or holding funds. Their terms of service place the entire burden of due diligence on the user. As a result, the platform is highly susceptible to prepayment scams. Fraudulent actors posing as artisans often demand upfront fees for "transportation" or "materials purchasing" and subsequently abscond. 

To combat this, Jiji and similar platforms advise users to rely solely on physical meetings and cash-on-delivery models. While this works for purchasing physical goods (like a used phone), it is entirely inadequate for service-based transactions where the quality of work can only be assessed post-completion, and where the artisan requires assurance of payment before expending hours of manual labor.

### 2.5.2 Summary Table
Table 2.1 below summarizes the comparative analysis of existing systems versus the proposed ArtisanConnect platform, highlighting the distinct architectural differences in trust management.

#### Table 2.1: Summary of Comparative Platform Analysis

| Platform / Model | Primary Function | Trust & Verification Mechanism | Payment Security | Search Capability |
| :--- | :--- | :--- | :--- | :--- |
| **Traditional Word-of-Mouth** | Localized Networking | Personal Referral | Post-service Cash | Manual Inquiry |
| **Jiji Ghana / Tonaton** | Open Classified Ads Directory | User Reviews & Basic Reporting | None (Open Market / Cash) | Rigid Keyword Search |
| **Uber / Bolt (Gig Economy)** | Managed Ride-Hailing | ID Verification & Rating system | Card Authorization / Cash | Geolocation matching |
| **Proposed: ArtisanConnect** | Managed Two-Sided Marketplace | Govt. ID Verification (Ghana Card) | Integrated Digital Escrow | AI Semantic/Hybrid Search |

## 2.6 Conclusion
The comprehensive review of the literature indicates a significant, unaddressed gap in the Ghanaian market for a managed, trust-centric digital platform tailored specifically for the artisanal sector. While the digital gig economy is expanding rapidly through generalized classifieds like Jiji Ghana, the critical absence of escrow payment mechanisms and intelligent, intent-based matching systems continually exposes users to fraud and severe operational inefficiencies. 

ArtisanConnect proposes to fill this exact gap. By merging digital financial escrow, AI hybrid search, and automated dispute resolution into a single cohesive platform, it aims to foster a secure, reliable, and highly scalable ecosystem that protects consumers while empowering informal artisans.

---
## References
*   Anyidoho, N. A. (2013) 'Informal Economy in Ghana', *Ghana Studies*, 15(1), pp. 7-30.
*   Bansal, G., Zahedi, F. M. and Gefen, D. (2004) 'The impact of personal dispositions on information sensitivity, privacy concern and trust in disclosing health information online', *Decision Support Systems*, 49(2), pp. 138-150.
*   Graham, M., Hjorth, I. and Lehdonvirta, V. (2017) 'Digital labour and development: impacts of global digital labour platforms and the gig economy on worker livelihoods', *Transfer: European Review of Labour and Research*, 23(2), pp. 135-162.
*   Heeks, R. (2017) *Information and Communication Technology for Development (ICT4D)*. Abingdon: Routledge.
*   Osei-Boateng, C. and Ampratwum, E. (2011) *The Informal Sector in Ghana*. Accra: Friedrich-Ebert-Stiftung.
*   Pavlou, P. A. and Gefen, D. (2004) 'Building effective online marketplaces with institution-based trust', *Information Systems Research*, 15(1), pp. 37-59.
*   Rule, C. (2020) 'Online Dispute Resolution and the Future of Justice', *Annual Review of Law and Social Science*, 16, pp. 277-292.
*   Turney, P. D. (2001) 'Mining the Web for Synonyms: PMI-IR versus LSA on TOEFL', *Machine Learning: ECML 2001*, pp. 491-502.
