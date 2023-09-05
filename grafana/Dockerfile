FROM grafana/grafana:10.0.3
COPY ./provisioning /etc/grafana/provisioning
COPY ./dashboards /var/lib/grafana/dashboards
COPY ./grafana.ini /etc/grafana/grafana.ini
EXPOSE 3000

