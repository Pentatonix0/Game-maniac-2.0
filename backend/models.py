from exts import db


# Базовый класс для всех моделей
class BaseModel(db.Model):
    __abstract__ = True

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


# Таблица пользователей
class User(BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False)
    company = db.Column(db.String(80), nullable=False)
    password = db.Column(db.Text, nullable=False)
    role = db.Column(db.Text, nullable=False)
    registration_date = db.Column(db.DateTime, nullable=False)

    # Связь с таблицей UsersOrdersApplications
    orders = db.relationship('UsersOrdersApplications',
                             backref='User', lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"


# Таблица заказов администратора
class AdminOrders(BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.Integer, nullable=False)
    order_items = db.Column(db.JSON, nullable=False)
    publishing_date = db.Column(db.DateTime, nullable=False)
    permitted_providers = db.Column(db.JSON, nullable=False)
    participating_providers = db.Column(db.JSON, nullable=True)
    bidding_deadline = db.Column(db.DateTime, nullable=True)
    haggled_providers = db.Column(db.JSON, nullable=True)

    # Связь с таблицей UsersOrdersApplications
    user_orders = db.relationship(
        'UsersOrdersApplications',
        backref='order',
        lazy=True
    )

    def __repr__(self):
        return f"<CurrentAdminOrder {self.title}>"

    def __setStatus(self, new_status):
        self.status = new_status
        db.session.commit()

    def __setDeadline(self, deadline):
        self.bidding_deadline = deadline
        db.session.commit()

    def __setParticipatingProviders(self, new_participating_providers):
        self.participating_providers = new_participating_providers
        db.session.commit()

    def addParticipator(self, paricipator):
        if paricipator.id not in self.participating_providers:
            self.__setParticipatingProviders(
                self.participating_providers + [paricipator.id])

    def startBidding(self, deadline):
        self.__setStatus(203)
        self.__setDeadline(deadline)
        user_orders = [order for order in self.user_orders if order.user_id in self.participating_providers]
        print(user_orders)

        for user_order in user_orders:
            user_order.startBidding(deadline)


# Таблица заказов пользователей
class UsersOrdersApplications(BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey(
        'admin_orders.id'), nullable=False)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    data = db.Column(db.JSON, nullable=False)
    publishing_date = db.Column(db.DateTime, nullable=False)
    bidding_deadline = db.Column(db.DateTime, nullable=True)
    is_haggled = db.Column(db.Boolean, nullable=False)
    updates_counter = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<CurrentUsersOrder User {self.user_id} - Order {self.order_id}>"

    def __setData(self, new_data):
        self.data = new_data
        db.session.commit()

    def __setDeadLine(self, deadline):
        self.bidding_deadline = deadline
        db.session.commit()

    def __setStatus(self, new_status):
        self.status = new_status
        db.session.commit()

    def participate(self, data):
        self.__setData(data)
        self.__setStatus(101)

    def startBidding(self, deadline):
        self.__setStatus(103)
        self.__setDeadLine(deadline)

    def haggle(self):
        pass


# Таблица архивных заказов пользователей (отдельная таблица)
class ArchivedUsersOrdersApplications(BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey(
        'admin_orders.id'), nullable=False)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    data = db.Column(db.JSON, nullable=False)  # Может быть null
    publishing_date = db.Column(db.DateTime, nullable=False)
    archived_date = db.Column(db.DateTime, nullable=False)


class PersonalOrders(BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey(
        'admin_orders.id'), nullable=False)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    data = db.Column(db.JSON, nullable=False)
    is_trivial = db.Column(db.Boolean, nullable=False)
